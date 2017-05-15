
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;

public class Kruskal {
	/**
		Kruskal算法的过程：

		（1） 将全部边按照权值由小到大排序。
		（2） 按顺序（边权由小到大的顺序）考虑每条边，
			只要这条边和我们已经选择的边不构成圈，（并查集）
			就保留这条边，否则放弃这条边。
		
		输入
		第1行：2个数N,M中间用空格分隔，N为点的数量，M为边的数量。（2 <= N <= 1000, 1 <= M <= 50000)
		第2 - M + 1行：每行3个数S E W，分别表示M条边的2个顶点及权值。(1 <= S, E <= N，1 <= W <= 10000)
		
		输出
		输出最小生成树的所有边的权值之和。
		输入示例
			
			9 14
			1 2 4
			2 3 8
			3 4 7
			4 5 9
			5 6 10
			6 7 2
			7 8 1
			8 9 7
			2 8 11
			3 9 2
			7 9 6
			3 6 4
			4 6 14
			1 8 8
			
			输出示例
			
			37
	 * @param args
	 */
	public static void main(String[] args) {

		Scanner in = new Scanner(System.in);
		int N = in.nextInt();//N为点的数量
		int M = in.nextInt();//M为边的数量
		//第2 ---M + 1行
		//记录每条边的信息
		Set<TreeItem> tree=new TreeSet<TreeItem>(new Comparator<TreeItem>(){
			@Override
			public int compare(TreeItem o1, TreeItem o2) {
				return o1.W<o2.W?-1:1;
			}
			
		});
		//此处内存开辟了  M 
		for(int i=0;i<M;i++){
			TreeItem item=new TreeItem();
			item.S=in.nextInt();
			item.E=in.nextInt();
			item.W=in.nextInt();
			tree.add(item);
			//System.out.println(s+" "+e+" "+W);
		}
//		for(TreeItem item:tree){
//			System.out.println(item.toString());
//		}
		System.out.println("---------------------");
		/**
		（1） 将全部边按照权值由小到大排序。
		（2） 按顺序（边权由小到大的顺序）考虑每条边，
			只要这条边和我们已经选择的边不构成圈，
			就保留这条边，否则放弃这条边。
		 */
		//建立N棵树 
		Set<Set<Integer>> trees=new HashSet<Set<Integer>>();
		//make-set
		
		for(int i=1;i<=N;i++){
			Set<Integer> V=new HashSet<Integer>();//保存已经选择的点 
			V.add(i);
			trees.add(V);
		}
		
		Set<TreeItem> selectItems=new HashSet<TreeItem>();//保存最小生成树的	
		int sum=0;

		Iterator<TreeItem> iterator = tree.iterator();

		while(iterator.hasNext()){//M 条边
			TreeItem selectItem=new TreeItem();
			TreeItem item=iterator.next();
			//每次选择一条边（v1,v2）， 
			//	只要这条边和我们已经选择的边不构成圈，
			//就保留这条边，否则放弃这条边。
			//如何才是不构成圈 ?思考 已经选择 bc bd  再选cd 构成圈 此时cd 不选
			//只要判断当前的item 加入 会不会构成圈  不就ok了
			Set<Integer> tree_s=findSet(item.S,trees);
			Set<Integer> tree_e=findSet(item.E,trees);
			if(tree_s!=tree_e){	 //u 和 v 不在同一棵子树
				selectItem=item;
				
				System.out.println(selectItem.toString());
				
				selectItems.add(selectItem);
				
				sum+=selectItem.W;
				
				//將 u 和 v 所在的子树合并
				union(tree_s,tree_e,trees);
				
			}
			
			
	
		}
			
		System.out.println(sum);
		
//		for(Set<Integer> tree_:trees){
//			System.out.println(tree_.toString());
//
//		}
	}

	private static void union(Set<Integer> tree_s, Set<Integer> tree_e,Set<Set<Integer>> trees) {
		tree_s.addAll(tree_e);
		trees.remove(tree_e);
	}

	private static Set<Integer> findSet(int s, Set<Set<Integer>> trees) {
		for(Set<Integer> tree:trees){
			if(tree.contains(s))
				return tree;
		}
		return null;
	}
	
//		int sum=0;
//		for(TreeItem item :selectItems){
//			sum+=item.W;
//		}
//	}	
}
class TreeItem{
	int S;
	int E;//顶点  W//权值
	public int W;
	
	public String toString(){
		return S+" "+E+" "+W;
		
	}
}